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

    def __init__(self):
        self._init_conn()
        return

    def _init_conn(self):
        self.conn = psycopg2.connect(os.environ['POSTGRES_CONN_URI_CULANTH'])
        return

    def _rollback_and_close(self, cur):
        try:
            self.conn.rollback()
            cur.close()
            self.conn.close()
        except Exception as e:
            return

    def _query(self, sql, sql_params=()):
        ret = None
        retries = 2
        for i in range(retries):
            cur = None
            try:
                cur = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
                cur.execute(sql, sql_params)
                ret = cur.fetchall()
                self.conn.commit()
                cur.close()
                return True, ret
            except Exception as e:
                self._rollback_and_close(cur)
            self._init_conn()
            if i == retries-1:
                return False, e

    def _generate_json_from_row(self, info):
        return {
            self.STORY_ID : info[0],
            self.TITLE : info[1],
            self.AUTHOR : info[2],
            self.DATE_ADDED : str(info[3]),
            self.LATITUDE : info[4],
            self.LONGITUDE : info[5],
            self.STORY : info[6],
            self.CATEGORY : info[7]
        }

    def get(self):
        sql = '''
            SELECT story_id, title, author, date_added, latitude, longitude, story, category
            FROM Stories
        '''
        suc, infos = self._query(sql)
        ret = {
            self.DATA : []
        }
        for info in infos:
            ret[self.DATA].append(self._generate_json_from_row(info))
        return ret

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(self.TITLE, required=True, type=str, location="json")
        parser.add_argument(self.AUTHOR, required=True, type=str, location="json")
        parser.add_argument(self.LATITUDE, required=True, type=float, location="json")
        parser.add_argument(self.LONGITUDE, required=True, type=float, location="json")
        parser.add_argument(self.STORY, required=True, type=str, location="json")
        parser.add_argument(self.CATEGORY, required=True, type=str, location="json")
        params = parser.parse_args()
        sql = '''
            INSERT INTO Stories(title, author, latitude, longitude, story, category)
            VALUES(%s, %s, %s, %s, %s, %s)
            RETURNING story_id, title, author, date_added, latitude, longitude, story, category
        '''
        sql_params = (params[self.TITLE], params[self.AUTHOR], params[self.LATITUDE],
            params[self.LONGITUDE], params[self.STORY], params[self.CATEGORY])
        suc, ret = self._query(sql, sql_params)
        return self._generate_json_from_row(ret[0])

def run_app():
    app = Flask(__name__)
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    api = StoriesApi(app)

    api.add_resource(Stories, '/stories')
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', type=int, required=True)
    args = parser.parse_args()
    app.run(host='0.0.0.0', port=args.p, debug=True)

if __name__ == '__main__':
    run_app()
