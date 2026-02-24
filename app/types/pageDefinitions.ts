import {
  BLOG_POST_DEFINITION as BASE_BLOG_POST_DEFINITION,
  DOCUMENT_DEFINITION,
} from "rimelight-components/types";
import { definePageDefinition } from "#rimelight-components/utils";
import { v7 as uuidv7 } from "uuid";

export { DOCUMENT_DEFINITION };

export const BLOG_POST_DEFINITION = definePageDefinition({
  ...BASE_BLOG_POST_DEFINITION,
  properties: {
    ...BASE_BLOG_POST_DEFINITION.properties,
    meta: {
      ...BASE_BLOG_POST_DEFINITION.properties["meta"]!,
      fields: {
        ...BASE_BLOG_POST_DEFINITION.properties["meta"]!.fields,
        category: {
          ...BASE_BLOG_POST_DEFINITION.properties["meta"]!.fields["category"]!,
          options: [{ en: "Company News" }, { en: "Development Log" }, { en: "New Release" }],
        },
      },
    },
  },
})

declare global {
  interface RimelightRegisterPageTypes {
    Document: typeof DOCUMENT_DEFINITION.properties;
    BlogPost: typeof BLOG_POST_DEFINITION.properties;
  }
}

export const PAGE_MAP = {
  Document: DOCUMENT_DEFINITION,
  BlogPost: BLOG_POST_DEFINITION,
}
