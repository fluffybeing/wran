from app import db
from datetime import datetime, timedelta
from hashlib import md5
#from werkzeug.security import generate_password_hash, check_password_hash

ROLE_USER = 0
ROLE_ADMIN = 1


class User(db.Model):
    __tablename__ = "users"
    fullname = db.Column('fullname', db.String(20))
    id = db.Column('user_id', db.Integer, primary_key=True)
    username = db.Column('username', db.String(20), unique=True, index=True)
    password = db.Column('password', db.String(10))
    email = db.Column('email', db.String(50), unique=True, index=True)
    registered_on = db.Column('registered_on', db.DateTime)
    #wran = db.relationship('WRAN', backref='dashboard', lazy='dynamic')

    def __init__(self, fullname, username, password, email):
        self.username = username
        self.password = password
        self.email = email
        self.fullname = fullname
        self.registered_on = datetime.utcnow()

    def set_password(self, password):
        self.password = password

    def check_password(self, password):
        if self.password == password:
            return True

    def avatar(self, size):
        return 'http://www.gravatar.com/avatar/' + md5(self.email).hexdigest() + '?d=mm&s=' + str(size)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.username)
