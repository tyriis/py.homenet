import os
import click
from score.db import load_data


@click.group()
def main():
    """
    Provides database management commands.
    """


@main.command()
@click.pass_context
def reset(click):
    """
    Drops and re-creates the database.
    """
    here = os.path.dirname(os.path.realpath(__file__))
    score = click.obj['conf'].load()
    with score.ctx.Context() as ctx:
        score.db.destroy()
        score.db.create()
        source = here + '/data/base.yaml'
        objects = load_data(source)
        for cls in objects:
            for id in objects[cls]:
                ctx.db.add(objects[cls][id])


@main.command()
@click.pass_context
def update(click):
    """
    Add new db models and members
    """
    here = os.path.dirname(os.path.realpath(__file__))
    score = click.obj['conf'].load()
    with score.ctx.Context() as ctx:
        score.db.create()
