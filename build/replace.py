import os


def get_first_node(path):
    return os.path.split(path)[0].split(os.sep)[0]


one_off_fixes_source = 'fixes'
one_off_fixes_destination = '..'

for root, dirs, files in os.walk(one_off_fixes_source):
    for file in files:
        fix_file = os.path.join(root, file)
        destination_file = fix_file.replace(get_first_node(fix_file), one_off_fixes_destination)
        os.replace(fix_file, destination_file)