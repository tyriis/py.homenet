"""add User persist_hash

Revision ID: 4aa861202c0f
Revises: 59479ec50ee3
Create Date: 2016-09-11 21:13:48.426957

"""

# revision identifiers, used by Alembic.
revision = '4aa861202c0f'
down_revision = '59479ec50ee3'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa
from homenet import db


def upgrade():
    op.drop_inheritance_view(db.User)
    op.add_column('_user', sa.Column('persist_hash', sa.String(), nullable=True))
    if op.get_context().dialect.name == 'postgresql':
        op.create_unique_constraint(None, '_user', ['persist_hash'])
    op.create_inheritance_view(db.User)


def downgrade():
    op.drop_inheritance_view(db.User)
    op.drop_constraint(None, '_user', type_='unique')
    op.drop_column('_user', 'persist_hash')
    op.crate_inheritance_view(db.User)
