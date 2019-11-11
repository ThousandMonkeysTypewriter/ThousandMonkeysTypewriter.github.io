import datrie
import string
import pickle
import json
import os
from bottle import route, run, request, response

rus_alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
alphs = string.ascii_lowercase + rus_alph + string.punctuation + string.digits + '\n '


def get_trie(element):
    if os.path.exists(element + '.trie'):
        trie = datrie.Trie.load(element + '.trie')
        return trie
    else:
        trie = datrie.Trie(alphs)
        for e in element_comments:
            if e != int(element):
                continue
            for comment in element_comments[e]:
                trie[comment.lower()] = element_comments[e][comment]
        trie.save(element + '.trie')
        return trie


def check_surroundings(word, trie):
    relevant = []
    for i in trie.keys():
        if word in i and not i.startswith(word):
            relevant.append(i)
    return relevant


def get_closest(word, element, n):
    trie = get_trie(element)
    relevant = trie.keys(word)
    if not relevant:
        relevant = check_surroundings(word, trie)
    most_freq = []
    for query in relevant:
        clear_query = query.replace('бэм', 'БЭМ')
        clear_query = clear_query[0].upper() + clear_query[1:]
        most_freq.append((clear_query, trie[query]))
    sorted_queries = sorted(most_freq, key=lambda x: x[1], reverse=True)
    top_n = [i[0] for i in sorted_queries[:n]]
    return top_n


@route('/query')
def index():
    response.content_type = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    prefix = request.query.term
    element = request.query.element_id
    suggestions = get_closest(prefix, element, 10)
    return json.dumps(suggestions)


if __name__ == '__main__':
    with open('element_comments.pickle', 'rb') as handle:
        element_comments = pickle.load(handle)
    run(host='78.46.103.68', port=1959)


