import json
import os
import time
from pathlib import Path

from kafka import KafkaProducer


BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
EVENTS = Path("/fixtures/events.json")


def main():
    producer = KafkaProducer(
        bootstrap_servers=BOOTSTRAP,
        value_serializer=lambda value: json.dumps(value).encode("utf-8"),
        key_serializer=lambda value: value.encode("utf-8"),
    )
    events = json.loads(EVENTS.read_text(encoding="utf-8"))
    round_id = 0
    while True:
        round_id += 1
        for event in events:
            payload = dict(event)
            payload["event_id"] = f"{event['event_id']}-r{round_id}"
            topic = "webshop.support" if event["event_type"] == "support_question" else "webshop.events"
            producer.send(topic, key=payload["session_id"], value=payload)
            print(f"sent {payload['event_id']} -> {topic}", flush=True)
            time.sleep(1.5)
        producer.flush()
        time.sleep(5)


if __name__ == "__main__":
    main()
