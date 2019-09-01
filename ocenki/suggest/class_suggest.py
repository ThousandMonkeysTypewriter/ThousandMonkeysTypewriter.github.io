import datrie
import string
import os
import pickle


rus_alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
alphs = string.ascii_lowercase + rus_alph + string.punctuation + string.digits + '\n '


if os.path.exists('my.trie'):
    print('Found a built trie')
    trie = datrie.Trie.load('my.trie')
else:
    print('Buidling trie structure')
    #print(f'Allowed chars are {alphs}')
    with open('comments_classes.pickle', 'rb') as handle:
        freqs = pickle.load(handle)
    trie = datrie.Trie(alphs)
    for i in freqs:
        trie[i.lower()] = freqs[i]
    trie.save('my.trie')


def check_surroundings(word):
    relevant = []
    for i in trie.keys():
        if word in i and not i.startswith(word):
            relevant.append(i)
    return relevant


def get_closest(word, n):
    relevant = trie.keys(word)
    if not relevant:
        relevant = check_surroundings(word)
    most_freq = []
    for query in relevant:
        most_freq.append((query, trie[query]))
    sorted_queries = sorted(most_freq, key=lambda x: x[1], reverse=True)
    top_n = [i[0] for i in sorted_queries[:n]]
    return top_n
