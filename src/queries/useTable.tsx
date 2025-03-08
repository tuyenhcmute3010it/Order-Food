import tablesApiRequest from "@/apiRequests/tables";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tablesApiRequest.list,
  });
};
export const useGetTable = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tablesApiRequest.getTable(id),
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tablesApiRequest.addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tablesApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tablesApiRequest.deleteTable,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
