from flask import render_template


class IneligibilityError(Exception):
    """
    Error class for handling the case where the user is ineligible to complete the task.
    """

    def __init__(self):
        self.template = "ineligible.html"

    def error_page(self, request, contact_on_error):
        return render_template(
            self.template,
            contact_address=contact_on_error,
            **request.args)
