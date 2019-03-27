# this file imports custom routes into the experiment server

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import exc

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError, InvalidUsage
from psiturk.user_utils import PsiTurkAuthorization, nocache

from customErrors import IneligibilityError

# # Database setup
import _mysql
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

# load the configuration options
config = PsiturkConfig()
config.load_config()
myauth = PsiTurkAuthorization(config)  # if you want to add a password protect route use this

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')


@custom_code.errorhandler(IneligibilityError)
def handle_ineligible(exception):
    current_app.logger.error(
        "Ineligibile participant: %s", str(dict(request.args)))
    return exception.error_page(request, config.get('HIT Configuration',
                                                    'contact_email_on_error'))

@custom_code.route('/ineligible')
def ineligible():
    current_app.logger.info("Participant ineligible")
    try:
        unique_id = request.args['uniqueId']
        current_app.logger.info("Marking ineligible %s" % unique_id)
        user = Participant.query. \
            filter(Participant.uniqueid == unique_id).one()
        user.status = 8 # INELIGIBLE
        db_session.add(user)
        db_session.commit()
    except exc.SQLAlchemyError:
        raise ExperimentError('tried_to_quit')
    raise IneligibilityError()


# ----------------------------------------------
# example using HTTP authentication
# ----------------------------------------------
@custom_code.route('/my_password_protected_route')
@myauth.requires_auth
def my_password_protected_route():
    try:
        return render_template('custom.html')
    except TemplateNotFound:
        abort(404)


# ----------------------------------------------
# example accessing data
# ----------------------------------------------
@custom_code.route('/view_data')
@myauth.requires_auth
def list_my_data():
    users = Participant.query.all()
    try:
        return render_template('list.html', participants=users)
    except TemplateNotFound:
        abort(404)


# ----------------------------------------------
# example computing bonus
# ----------------------------------------------

@custom_code.route('/compute_bonus', methods=['GET'])
def compute_bonus():
    # check that user provided the correct keys
    # errors will not be that gracefull here if being
    # accessed by the Javascript client
    if not request.args.has_key('uniqueId'):
        raise ExperimentError(
            'improper_inputs')  # i don't like returning HTML to JSON requests...  maybe should change this
    unique_id = request.args['uniqueId']

    # try:
    # lookup user in database
    # in order to check for IP address violations get the user this way and then check for user.ipaddress
    user = Participant.query. \
        filter(Participant.uniqueid == unique_id). \
        one()
    user_data = loads(user.datastring)  # load datastring from JSON
    bonus = 0

    for record in user_data['data']:  # for line in data file
        trial = record['trialdata']
        if trial['phase'] == 'trial' and trial['included']:
            bonus += float(trial['choice'])
        elif trial['phase'] == 'exit':
            bonus = 0
            break
    user.bonus = "%.2f" % round(bonus, 2)
    db_session.add(user)
    db_session.commit()
    resp = {"bonusComputed": "success"}
    return jsonify(**resp)
    # except:
    #    abort(404)  # again, bad to display HTML, but...
