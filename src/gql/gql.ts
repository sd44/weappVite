/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query FetchTabs {\n    litemallCategory(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { level: { eq: \"L1\" } }\n      limit: 8\n    ) {\n      id\n      name\n      iconUrl\n    }\n  }\n": typeof types.FetchTabsDocument,
    "\n  fragment GoodsItem on LitemallGoodsSelectItem{\n      id\n      goodsSn\n      name\n      categoryId\n      gallery\n      keywords\n      brief\n      picUrl\n      shareUrl\n      isNew\n      isHot\n      unit\n      counterPrice\n      retailPrice\n      detail\n}\n      ": typeof types.GoodsItemFragmentDoc,
    "\n  query FetchNewGoods($limit: Int!, $offset: Int!) {\n    litemallGoods(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { deleted: { eq: false }, isOnSale: { eq: true }, isNew: { eq: true } }\n      limit: $limit\n      offset: $offset\n    ) {\n      ...GoodsItem # 注意这里使用片段名GoodsItem，不是GoodsItemFragment\n    }\n  }\n": typeof types.FetchNewGoodsDocument,
};
const documents: Documents = {
    "\n  query FetchTabs {\n    litemallCategory(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { level: { eq: \"L1\" } }\n      limit: 8\n    ) {\n      id\n      name\n      iconUrl\n    }\n  }\n": types.FetchTabsDocument,
    "\n  fragment GoodsItem on LitemallGoodsSelectItem{\n      id\n      goodsSn\n      name\n      categoryId\n      gallery\n      keywords\n      brief\n      picUrl\n      shareUrl\n      isNew\n      isHot\n      unit\n      counterPrice\n      retailPrice\n      detail\n}\n      ": types.GoodsItemFragmentDoc,
    "\n  query FetchNewGoods($limit: Int!, $offset: Int!) {\n    litemallGoods(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { deleted: { eq: false }, isOnSale: { eq: true }, isNew: { eq: true } }\n      limit: $limit\n      offset: $offset\n    ) {\n      ...GoodsItem # 注意这里使用片段名GoodsItem，不是GoodsItemFragment\n    }\n  }\n": types.FetchNewGoodsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchTabs {\n    litemallCategory(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { level: { eq: \"L1\" } }\n      limit: 8\n    ) {\n      id\n      name\n      iconUrl\n    }\n  }\n"): (typeof documents)["\n  query FetchTabs {\n    litemallCategory(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { level: { eq: \"L1\" } }\n      limit: 8\n    ) {\n      id\n      name\n      iconUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GoodsItem on LitemallGoodsSelectItem{\n      id\n      goodsSn\n      name\n      categoryId\n      gallery\n      keywords\n      brief\n      picUrl\n      shareUrl\n      isNew\n      isHot\n      unit\n      counterPrice\n      retailPrice\n      detail\n}\n      "): (typeof documents)["\n  fragment GoodsItem on LitemallGoodsSelectItem{\n      id\n      goodsSn\n      name\n      categoryId\n      gallery\n      keywords\n      brief\n      picUrl\n      shareUrl\n      isNew\n      isHot\n      unit\n      counterPrice\n      retailPrice\n      detail\n}\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchNewGoods($limit: Int!, $offset: Int!) {\n    litemallGoods(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { deleted: { eq: false }, isOnSale: { eq: true }, isNew: { eq: true } }\n      limit: $limit\n      offset: $offset\n    ) {\n      ...GoodsItem # 注意这里使用片段名GoodsItem，不是GoodsItemFragment\n    }\n  }\n"): (typeof documents)["\n  query FetchNewGoods($limit: Int!, $offset: Int!) {\n    litemallGoods(\n      orderBy: { sortOrder: { direction: asc, priority: 10 } }\n      where: { deleted: { eq: false }, isOnSale: { eq: true }, isNew: { eq: true } }\n      limit: $limit\n      offset: $offset\n    ) {\n      ...GoodsItem # 注意这里使用片段名GoodsItem，不是GoodsItemFragment\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;