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
    for event in events:
        topic = "webshop.support" if event["event_type"] == "support_question" else "webshop.events"
        producer.send(topic, key=event["session_id"], value=event)
        print(f"sent {event['event_id']} -> {topic}")
        time.sleep(0.4)
    producer.flush()


if __name__ == "__main__":
    main()
