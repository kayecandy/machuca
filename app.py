from flask import Flask, render_template, request
from models import *

app = Flask( __name__ )
init_db_app( app )



@app.route('/')
def index(  ):
    return render_template( "index.html" )


@app.route('/3d')
def simulator_3D(  ):
    return render_template( "3d.html" )


@app.route( '/add_user', methods=['GET'] )
def add_user(  ):

	new_user = User( request.args.get( 'username' ), request.args.get( 'password' ) )
	new_user.create_user(  );
	

	return "user was added!<br>username: " + request.args.get( 'username' ) + "<br>password: " + request.args.get( 'password' )


@app.route( '/admin_login', methods=['POST'] )
def admin_login(  ):
	return render_template( "admin-login.html" );


if __name__ == '__main__':
	from os import environ
	port = int( environ.get( 'PORT', 5000 ) )
	app.run( debug=True, host='0.0.0.0', port=port )