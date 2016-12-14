from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import argparse
import os
import psycopg2
import psycopg2.extras

class StoriesApi(Api):
    pass

class Home(Resource):
    def get(self):
        return "CulAnth261FinalProject"

class Stories(Resource):

    STORY_ID = 'story_id'
    TITLE = 'title'
    AUTHOR = 'author'
    DATE_ADDED = 'date_added'
    LATITUDE = 'latitude'
    LONGITUDE = 'longitude'
    STORY = 'story'
    CATEGORY = 'category'
    DATA = 'data'

    def _query(self, sql, sql_params=()):
        conn = psycopg2.connect(os.environ['POSTGRES_CONN_URI_CULANTH'])
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        try:
            cur.execute(sql, sql_params)
            ret = cur.fetchall()
            conn.commit()
            cur.close()
            conn.close()
            return True, ret
        except Exception as e:
            conn.rollback()
        cur.close()
        conn.close()

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument(self.STORY_ID, required=False, type=str, location="args")
        params = parser.parse_args()
        if params[self.STORY_ID] != None:
            sql = '''
                SELECT story_id, title, author, date_added, latitude, longitude, story, category
                FROM Stories
                WHERE story_id=%s
            '''
            sql_params = (params[self.STORY_ID],)
            suc, infos = self._query(sql, sql_params)
            return {
                self.DATA : [{
                    self.STORY_ID : info[0],
                    self.TITLE : info[1],
                    self.AUTHOR : info[2],
                    self.DATE_ADDED : str(info[3]),
                    self.LATITUDE : info[4],
                    self.LONGITUDE : info[5],
                    self.STORY : info[6],
                    self.CATEGORY : info[7]
                    } for info in infos]
                }
        else:
            sql = '''
                SELECT story_id, title, author, date_added, latitude, longitude, category
                FROM Stories
            '''
            suc, infos = self._query(sql)
            return {
                self.DATA : [{
                    self.STORY_ID : info[0],
                    self.TITLE : info[1],
                    self.AUTHOR : info[2],
                    self.DATE_ADDED : str(info[3]),
                    self.LATITUDE : info[4],
                    self.LONGITUDE : info[5],
                    self.CATEGORY : info[6]
                    } for info in infos]
                }

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(self.TITLE, required=True, type=str, location="json")
        parser.add_argument(self.AUTHOR, required=True, type=str, location="json")
        parser.add_argument(self.LATITUDE, required=True, type=float, location="json")
        parser.add_argument(self.LONGITUDE, required=True, type=float, location="json")
        parser.add_argument(self.STORY, required=True, type=str, location="json")
        parser.add_argument(self.CATEGORY, required=True, type=str, location="json")
        params = parser.parse_args()
        print params
        sql = '''
            INSERT INTO Stories(title, author, latitude, longitude, story, category)
            VALUES(%s, %s, %s, %s, %s, %s)
            RETURNING story_id, title, author, date_added, latitude, longitude, story, category
        '''
        sql_params = (params[self.TITLE], params[self.AUTHOR], params[self.LATITUDE],
            params[self.LONGITUDE], params[self.STORY], params[self.CATEGORY])
        suc, infos = self._query(sql, sql_params)
        info = infos[0]
        return {
            self.STORY_ID : info[0],
            self.TITLE : info[1],
            self.AUTHOR : info[2],
            self.DATE_ADDED : str(info[3]),
            self.LATITUDE : info[4],
            self.LONGITUDE : info[5],
            self.STORY : info[6],
            self.CATEGORY : info[7],
            'Access-Control-Allow-Headers' : 'application/json'
        }

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument(self.STORY_ID, required=True, type=str, location="args")
        params = parser.parse_args()
        sql = '''
            DELETE FROM Stories WHERE story_id=%s
            RETURNING story_id
        '''
        sql_params = (params[self.STORY_ID],)
        suc, infos = self._query(sql, sql_params)
        return {
            self.DATA : infos[0][0]
        }

def run_app():
    app = Flask(__name__)
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    api = StoriesApi(app)
    #api.decorators = [cors.crossdomain(origin='*', headers=['accept', 'Content-Type'])]

    api.add_resource(Stories, '/stories')
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', type=int, required=True)
    args = parser.parse_args()

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        return response
    app.run(host='0.0.0.0', port=args.p, debug=True)

if __name__ == '__main__':
    run_app()
