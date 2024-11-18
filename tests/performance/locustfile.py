import time, requests
from locust import HttpUser, task, between, events, tag
from locust.clients import HttpSession

eventId = None

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    global eventId
    
    response = requests.post(f"{environment.host}/api/events", json={
        "name": "Test Event " + str(int(time.time())),
        "totalTickets": 1000000000,
    })
    if response.status_code == 200:
        eventId = response.json()["id"]
    else:
        raise Exception("Failed to create event")

class QuickstartUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        self.client.get("/")

    @tag("reserve_ticket")
    @task
    def reserve_ticket(self):
        response = self.client.post("/api/tickets", json={
            "eventId": eventId,
        })
