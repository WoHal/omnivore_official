#!/bin/sh

yarn workspace @omnivore/api start_queue_processor &
yarn workspace @omnivore/api start_export_processor &
yarn workspace @omnivore/api start