import os
from setuptools import setup

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.rst')) as f:
    README = f.read()

setup(
    name='homenet',
    version='0.0.1',
    long_description=README,
    author='strg.at',
    author_email='score@strg.at',
    url='http://score-framework.org',
    keywords='score framework projects loader',
    packages=['homenet'],
    zip_safe=False,
    license='LGPL',
    install_requires=[
        'score.init',
        'score.shell',
        'score.db',
        'score.ctx',
        'score.cli',
        'score.http',
        'score.serve',
        'score.auth',
        'score.session',
        'score.html',
        'score.tpl[jinja2]',
        'sqlalchemy_utils',
        'passlib',
        'PyYAML',
        'docutils'
    ],
    entry_points={
        'score.cli': [
            'db = homenet.cli.db:main',
            'mqtt = homenet.cli.mqtt:main',
        ],
    },
)

