#!/bin/bash
git subtree pull -P unit_01/examples/example_express example-express master --squash
git subtree pull -P unit_02/examples/notepad_mysql notepad-mysql master --squash
git subtree pull -P unit_04/examples/notepad_mongodb notepad-mongodb master --squash
git subtree pull -P unit_05/examples/notepad_mongodb_react notepad-react master --squash

