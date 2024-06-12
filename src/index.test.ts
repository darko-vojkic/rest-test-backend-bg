import request from 'supertest';
import app from './index';

describe('App test', () => {
    test('should return correct json format on get /api/files request', async () => {
        const mockResponse = {
            items: [
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/db/txn-current-lock"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/db/txn-protorevs/"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/db/uuid"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/db/write-lock"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/format"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/hooks/"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/hooks/post-commit.tmpl"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/hooks/post-lock.tmpl"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/hooks/post-revprop-change.tmpl"},
                {"fileUrl": "http://34.8.32.234:48183/SvnRep/ZYPZ-ADMIN/hooks/post-unlock.tmpl" },
            ]
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
              json: () => Promise.resolve(mockResponse),
            }),
          ) as jest.Mock;
        const res = await request(app).get('/api/files')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            "34.8.32.234:48183": [{
                "SvnRep": [{
                    "ZYPZ-ADMIN": [{
                        "db": [
                            "txn-current-lock",
                            {
                                "txn-protorevs": []
                            },
                            "uuid",
                            "write-lock"
                        ]
                    },
                    "format",
                    {
                        "hooks": [
                            "post-commit.tmpl",
                            "post-lock.tmpl",
                            "post-revprop-change.tmpl",
                            "post-unlock.tmpl",
                        ]
                    }]
                }]
            }]
        })
    })
});
