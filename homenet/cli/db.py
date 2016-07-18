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
    score = click.obj['conf'].load()
    with score.ctx.Context() as ctx:
        score.db.destroy()
        score.db.create()
        source = 'http://score-framework.org/doc/_downloads/moswblog.yaml'
        objects = load_data(source)
        for cls in objects:
            for id in objects[cls]:
                ctx.db.add(objects[cls][id])
