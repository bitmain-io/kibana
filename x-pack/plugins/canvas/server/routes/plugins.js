/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getPluginStream } from '../lib/get_plugin_stream';
import { pluginPaths } from '../lib/plugin_paths';

export function plugins(server) {
  server.route({
    method: 'GET',
    path: '/api/canvas/plugins',
    handler: function(request, h) {
      const { type } = request.query;

      if (!pluginPaths[type]) return h.response({ error: 'Invalid type' }).code(400);

      return getPluginStream(type);
    },
    config: {
      auth: false,
    },
  });
}
