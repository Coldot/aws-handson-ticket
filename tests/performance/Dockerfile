FROM python:3.11-slim

RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo Asia/Seoul > /etc/timezone

WORKDIR /app
COPY . .

RUN pip install locust
ENTRYPOINT ["locust", "-f", "locustfile.py"]