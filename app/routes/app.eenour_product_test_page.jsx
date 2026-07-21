// app/routes/eenour_product_test_page.jsx
import { json } from "@remix-run/node";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { TitleBar } from "@shopify/app-bridge-react";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    try {
        const result = await admin.graphql(`
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              status
              variants(first: 1) {
                edges {
                  node {
                    price
                  }
                }
              }
            }
          }
        }
      }
    `);
    const graphqlData = await result.json();
        console.log("打印 result:", result,graphqlData);
        // ✅ 关键：result 就是根级数据
        return json({ products: graphqlData.data.products });
    } catch (error) {
        console.error("GraphQL error detail:", error);
        return json(
            { error: error?.message || "Failed to load products" },
            { status: 500 }
        );
    }
};

export default function EENOURProductTestPage() {
    const { products, error } = useLoaderData();
    console.log("🚀 ~ EENOURProductTestPage ~ products:", products,error)

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: "1rem" }}>
            <TitleBar title="EENOUR 产品测试页" />

            <h2>产品列表</h2>

            <p>
                {JSON.stringify(products, null, 2)}
            </p>

            {products?.edges?.length ? (
                <ul>
                    {products.edges.map(({ node }) => {
                        const variant = node.variants?.edges?.[0]?.node;

                        return (
                            <li key={node.id} style={{ marginBottom: "1rem" }}>
                                <strong>{node.title}</strong>
                                <br />
                                状态：{node.status}
                                <br />
                                Handle：{node.handle}
                                <br />
                                价格：¥{variant?.price}
                                <br />
                                <a
                                    href={`/admin/products/${node.id.split("/").pop()}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    编辑产品
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>没有找到产品</p>
            )}

            <div onClick={testFunction}>
                点击打印
            </div>
            
        </div>
    );
}

export function testFunction(){
    console.log('123')
}