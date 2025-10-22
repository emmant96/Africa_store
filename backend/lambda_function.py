import json, boto3, uuid, datetime

dynamodb = boto3.resource('dynamodb')
products_table = dynamodb.Table('Products')
orders_table = dynamodb.Table('Orders')

def lambda_handler(event, context):
    method = event.get("httpMethod")
    path = event.get("path", "")

    if method == "GET" and path == "/products":
        return get_products()
    elif method == "POST" and path == "/orders":
        return create_order(json.loads(event["body"]))
    else:
        return respond(404, {"error": "Invalid route"})

def get_products():
    items = products_table.scan().get("Items", [])
    return respond(200, items)

def create_order(body):
    order_id = body.get("orderId") or str(uuid.uuid4())
    body["timestamp"] = datetime.datetime.utcnow().isoformat()
    orders_table.put_item(Item=body)
    return respond(200, {"message": "Order stored", "orderId": order_id})

def respond(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }
