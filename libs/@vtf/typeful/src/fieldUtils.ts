import {inject} from "vue"

import TfFields from "@vtf-typeful/TfFields";

export const useFields = () => inject('vtf-fields') as TfFields
