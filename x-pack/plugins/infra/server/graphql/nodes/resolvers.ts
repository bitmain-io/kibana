/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { InfraResponse, InfraSourceResolvers } from '../../../common/graphql/types';
import { InfraResolvedResult, InfraResolverOf } from '../../lib/adapters/framework';
import { InfraNodeRequestOptions } from '../../lib/adapters/nodes';
import { extractGroupByAndMetrics } from '../../lib/adapters/nodes/extract_group_by_and_metrics';
import { formatResponse } from '../../lib/adapters/nodes/format_response';
import { InfraNodesDomain } from '../../lib/domains/nodes_domain';
import { InfraContext } from '../../lib/infra_types';
import { QuerySourceResolver } from '../sources/resolvers';

type InfraSourceMapResolver = InfraResolverOf<
  InfraSourceResolvers.MapResolver,
  InfraResolvedResult<QuerySourceResolver>,
  InfraContext
>;

interface NodesResolversDeps {
  nodes: InfraNodesDomain;
}

export const createNodeResolvers = (
  libs: NodesResolversDeps
): {
  InfraSource: {
    map: InfraSourceMapResolver;
  };
} => ({
  InfraSource: {
    async map(source, args, { req }, info) {
      const { groupBy, metrics, nodeType, nodesKey } = extractGroupByAndMetrics(info);

      const options: InfraNodeRequestOptions = {
        filters: args.filters || [],
        groupBy,
        sourceConfiguration: source.configuration,
        metrics,
        nodeType,
        nodesKey,
        timerange: args.timerange,
      };

      const response: InfraResponse = await libs.nodes.getNodes(req, options);
      return formatResponse(options, response);
    },
  },
});
