#!/bin/sh
set -e

envsubst < /usr/local/etc/redis/users-template.acl > /usr/local/etc/redis/users.acl

exec redis-server --aclfile /usr/local/etc/redis/users.acl