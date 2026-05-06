import os

import pandas as pd
import requests
import streamlit as st


API_URL = os.getenv("API_URL", "http://localhost:8000").rstrip("/")

st.set_page_config(page_title="WebShop Pro AI Support", page_icon="🛒", layout="wide")
st.title("WebShop Pro AI Support & Churn Lab")
st.caption("Streamlit felület az AI Engineering, RAG és MLOps kurzusokhoz.")


def get_json(path):
    response = requests.get(f"{API_URL}{path}", timeout=5)
    response.raise_for_status()
    return response.json()


left, right = st.columns([1.2, 0.8])

try:
    metrics = get_json("/api/metrics")
    catalog = pd.DataFrame(get_json("/api/catalog"))
    events = pd.DataFrame(get_json("/api/events"))
except Exception as exc:
    st.error(f"Nem érem el a FastAPI service-t: {exc}")
    st.stop()

with left:
    st.subheader("Gold KPI réteg")
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Bevétel", f"{metrics['revenue']:,} Ft".replace(",", " "))
    k2.metric("Paid orders", metrics["paid_orders"])
    k3.metric("AOV", f"{metrics['avg_order_value']:,} Ft".replace(",", " "))
    k4.metric("Support ticket", metrics["support_tickets"])

    st.subheader("Termékkatalógus")
    st.dataframe(catalog, use_container_width=True, hide_index=True)

with right:
    st.subheader("Churn prediction API")
    customer_id = st.selectbox("Customer", sorted(events["customer_id"].unique().tolist()))
    if st.button("Predict", type="primary"):
        result = requests.post(f"{API_URL}/predict", json={"customer_id": customer_id}, timeout=5)
        result.raise_for_status()
        payload = result.json()
        st.metric("Churn probability", f"{payload['churn_probability'] * 100:.1f}%")
        st.write(payload["reason"])
        st.json(payload["features"])

    st.subheader("RAG support minta")
    question = st.text_input("Vevői kérdés", "Mikor érkezik meg a monitorom?")
    if question:
        st.info(
            "Demo válasz: a szállítási szabályzat és a rendelések alapján a fizetett rendelés "
            "várhatóan 2 munkanapon belül érkezik. A ChromaDB itt tárolná a szabályzat chunkokat."
        )

st.divider()
st.caption(f"API backend: {API_URL}")
