from alembic import context
from score.db import IdType
from score.init import init_from_file as scoreinit
from score.cli.conf import default_file


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# init score from core onfig or default conf
config_file = config.get_main_option('ini')
if not config_file:
    config_file = default_file()
conf = scoreinit(config_file)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = conf.db.Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def render_item(type_, obj, autogen_context):
    """
    Custom rendering of ID types.
    http://alembic.readthedocs.org/en/rel_0_7/autogenerate.html#autogen-render-types
    """
    if type_ == 'type' and obj == IdType:
        return "db.IdType"
    return False


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = conf.db.engine.url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = conf.db.engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
