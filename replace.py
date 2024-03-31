import os
import shutil

def get_first_node(path):
    return os.path.split(path)[0].split(os.sep)[0]

one_off_fixes_source = os.path.join('one-offs', 'fixes')
one_off_fixes_destination = ''

for root, dirs, files in os.walk(one_off_fixes_source):
    for file in files:
        fix_file = os.path.join(root, file)
        if (not os.path.isfile(fix_file)):
            continue
        destination_file = fix_file.replace(one_off_fixes_source + os.path.sep, one_off_fixes_destination)
        shutil.copy(fix_file, destination_file)
