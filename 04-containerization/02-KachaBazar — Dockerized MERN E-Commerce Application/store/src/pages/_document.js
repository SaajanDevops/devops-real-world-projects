// import SettingServices from "@services/SettingServices";
// import Document, { Html, Head, Main, NextScript } from "next/document";

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      setting: null,
    };
  }

  render() {
    const setting = this.props.setting;

    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content={
              setting?.meta_description ||
              "KachaBazar - React Next eCommerce Template"
            }
          />

          <meta
            name="keywords"
            content={setting?.meta_keywords || "ecommerce, online store"}
          />

          <link rel="icon" href={setting?.favicon || "/favicon.png"} />

          <meta
            property="og:title"
            content={
              setting?.meta_title ||
              "KachaBazar - React Next eCommerce Template"
            }
          />

          <meta
            property="og:description"
            content={
              setting?.meta_description ||
              "KachaBazar - React Next eCommerce Template"
            }
          />

          <meta
            property="og:image"
            content={setting?.meta_image || "/favicon.png"}
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

// class MyDocument extends Document {
//   static async getInitialProps(ctx) {
//     const initialProps = await Document.getInitialProps(ctx);

//     // Fetch general metadata from backend API
//     const setting = await SettingServices.getStoreSeoSetting();

//     return { ...initialProps, setting };
//   }

//   render() {
//     const setting = this.props.setting;
//     return (
//       <Html lang="en">
//         <Head>
//           <link rel="icon" href={setting?.favicon || "/favicon.png"} />
//           <meta
//             property="og:title"
//             content={
//               setting?.meta_title ||
//               "KachaBazar - React Grocery & Organic Food Store e-commerce Template"
//             }
//           />
//           <meta property="og:type" content="eCommerce Website" />
//           <meta
//             property="og:description"
//             content={
//               setting?.meta_description ||
//               "React Grocery & Organic Food Store e-commerce Template"
//             }
//           />
//           <meta
//             name="keywords"
//             content={setting?.meta_keywords || "ecommenrce online store"}
//           />
//           <meta
//             property="og:url"
//             content={
//               setting?.meta_url || "https://kachabazar-store.vercel.app/"
//             }
//           />
//           <meta
//             property="og:image"
//             content={
//               setting?.meta_img ||
//               "https://res.cloudinary.com/ahossain/image/upload/v1636729752/facebook-page_j7alju.png"
//             }
//           />
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;
