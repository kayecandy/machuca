from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy(  )

def init_db_app( app ):
	app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost:3306/machuca'
	db.init_app( app )



class User( db.Model ):
	__tablename__ = 'user'

	id_user = db.Column( db.Integer, primary_key=True )
	username = db.Column( db.String( 120 ), nullable=False )
	password = db.Column( db.String( 120 ), nullable=False )
	role = db.Column( db.String( 120 ), nullable=True )

	def __init__( self, username, password ):
		self.username = username
		self.password = password
		self.role = ''

	def create_user( self ):
		db.session.add( self )
		db.session.commit(  )
