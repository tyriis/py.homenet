import click
from score.db import load_data


@click.group()
def main():
    """
    Provides database management commands.
    """


@main.command()
@click.pass_context
def start(click):
    """
    start the mqtt connection and subscribe to topics.
    """
    score = click.obj['conf'].load()
    with score.ctx.Context() as ctx:
        score.mqtt.subscribe('$SYS/broker/uptime', on_message)

def on_message(msg):
    print(msg.payload)
