import http from "@/lib/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
const prefix = "/tables";
const tablesApiRequest = {
  list: () => http.get<TableListResType>(`${prefix}`),
  addTable: (body: CreateTableBodyType) =>
    http.post<TableResType>(`${prefix}`, body),
  updateTable: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`${prefix}/${id}`, body),
  getTable: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
  deleteTable: (id: number) => http.delete<TableResType>(`${prefix}/${id}`),
};
export default tablesApiRequest;
