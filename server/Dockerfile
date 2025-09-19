FROM golang:1.24.4-bullseye AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -o server .

FROM debian:bookworm-slim

WORKDIR /app

COPY .env .
COPY --from=builder /app/ .

RUN ls -alh /app

CMD ["/app/server"]