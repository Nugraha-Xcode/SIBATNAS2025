import redis

class SessionStore:
    """Store session data in Redis."""

    def __init__(self, token, url='redis://redis:6379', ttl=600):
        self.token = token
        self.redis = redis.Redis.from_url(url)
        self.ttl = ttl

    def set(self, key, value):
        self.refresh()
        return self.redis.hset(self.token, key, value)
    
    def mset(self, key, value):
        self.refresh()
        return self.redis.mset(self.token, key, value)

    def get(self, key, value):
        self.refresh()
        return self.redis.hget(self.token, key)

    def incr(self, key):
        self.refresh()
        return self.redis.hincrby(self.token, key, 1)

    def refresh(self):
        self.redis.expire(self.token, self.ttl)