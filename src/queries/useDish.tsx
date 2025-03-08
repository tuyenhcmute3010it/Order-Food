import dishesApiRequest from "@/apiRequests/dish";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDishList = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: dishesApiRequest.list,
  });
};
export const useGetDish = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => dishesApiRequest.getDish(id),
    enabled,
  });
};

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishesApiRequest.addDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};
export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishesApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};
export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishesApiRequest.deleteDish,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};
