import datrie
import string
import pickle
import json
import os
from bottle import route, run, request, response

rus_alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
alphs = string.ascii_lowercase + rus_alph + string.punctuation + string.digits + '\n '


def get_trie(tag):
    if os.path.exists(tag + '.trie'):
        trie = datrie.Trie.load(tag + '.trie')
        return trie
    else:
        trie = datrie.Trie(alphs)
        for t in tag_comments:
            if t != tag:
                continue
            for comment in tag_comments[t]:
                trie[comment.lower()] = tag_comments[t][comment]
        trie.save(tag + '.trie')
        return trie


def check_surroundings(word, trie):
    relevant = []
    for i in trie.keys():
        if word in i and not i.startswith(word):
            relevant.append(i)
    return relevant


def get_closest(word, tag, n):
    trie = get_trie(tag)
    relevant = trie.keys(word)
    if not relevant:
        relevant = check_surroundings(word, trie)
    most_freq = []
    for query in relevant:
        most_freq.append((query, trie[query]))
    sorted_queries = sorted(most_freq, key=lambda x: x[1], reverse=True)
    top_n = [i[0] for i in sorted_queries[:n]]
    return top_n


@route('/query')
def index():
    response.content_type = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    prefix = request.query.term
    tag = request.query.tag
    suggestions = get_closest(prefix, tag, 10)
    return json.dumps(suggestions)


if __name__ == '__main__':
    with open('tag_comments.pickle', 'rb') as handle:
        tag_comments = pickle.load(handle)
    run(host='78.46.103.68', port=1959)




