{
  "checks": [
    {
      "name": "uptime",
      "url": "https://ceoapivault.vercel.app",
      "interval": 300,
      "timeout": 10,
      "threshold": 1,
      "alert": {
        "email": true,
        "slack": true
      }
    },
    {
      "name": "response_time",
      "url": "https://ceoapivault.vercel.app/api/health",
      "interval": 300,
      "timeout": 5,
      "threshold": 1000,
      "alert": {
        "email": true,
        "slack": true
      }
    },
    {
      "name": "status_code",
      "url": "https://ceoapivault.vercel.app",
      "interval": 300,
      "expected_status": 200,
      "alert": {
        "email": true,
        "slack": true
      }
    }
  ],
  "notifications": {
    "email": {
      "from": "monitoring@emmanuelos.com",
      "to": "devops@emmanuelos.com"
    },
    "slack": {
      "webhook_url": "$SLACK_WEBHOOK_URL"
    }
  }
}
