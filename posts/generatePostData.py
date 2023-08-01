import json

with open('posts.json', 'r') as f:
    current = 0
    complete = 0
    total = 0

    data = json.load(f)
    for post in data["posts"]["all"]:
        if post["active"]:
            current += 1
        else:
            complete += 1
    total = current + complete

    data["posts"]["stats"] = { "current": current, "complete": complete, "total": total }

with open('posts.json', 'w') as f:
    json.dump(data, f, indent=2)