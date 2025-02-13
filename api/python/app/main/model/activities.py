from .. import db

class Activities(db.Model):
    """ Activities Model for storing metadata related details """
    __tablename__ = 'activities'

    activities_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ip_address = db.Column(db.String(50), nullable=False)
    modul = db.Column(db.String(100), nullable=False)
    task = db.Column(db.String(100), nullable=False)
    data = db.Column(db.String(255), nullable=False)
    activity_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    users = db.relationship('User', backref=db.backref('parent_activity', lazy='dynamic'))