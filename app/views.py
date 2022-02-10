from app import app

from flask import render_template, request, jsonify, make_response, json, send_file



def saveJson(req):  
    
    id = 0
    for i in req:
        i['id'] = id
        id +=1

    with open("locations.json","w") as f:
        json.dump(req , f)


@app.route("/")
def index():
    return render_template("/index.html")


@app.route("/post-json", methods=["POST"])
def postJson():
    req = request.get_json()
    saveJson((req))
    return make_response(jsonify(req), 200)


@app.route("/get-json", methods=["GET"])
def getJson():
    with open("locations.json","r",encoding="utf-8") as file:
        content=file.read()
        jsonContent = json.loads(content)
        jsonArr=[]
        for i in jsonContent:
            jsonArr.append(i)

    return make_response(jsonify(jsonArr), 200)


@app.route('/download-json')
def downloadJson():
   return send_file('../locations.json', as_attachment=True)

