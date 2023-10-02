import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormLabel, FormItem, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

import { useNavigate } from "react-router-dom";
import { resetPasswordSchema } from "../../schema/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { putAPI } from "@/api/api";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const { toast } = useToast();
  const navigate = useNavigate();

  const initForm = {
    newPassword: "",
    confirmPassword: "",
  };

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: initForm,
  });

  const mutation = useMutation({
    mutationFn: async (setPassword) => {
      console.log(setPassword);
      await putAPI(`user/${userId}`, setPassword, token);
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({
      ...values,
    });
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset(initForm);
    }
  }, [form]);

  const formSuccess = mutation.isSuccess ? { title: "Success", desc: "Event sucessfully created." } : {};

  if (mutation.isSuccess) {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div>
        <span className="flex items-center gap-2 mb-6">
          <ArrowLeft className="w-6 h-6" onClick={() => navigate("/")} />
          <Label className="font-bold text-sm">Reset Password</Label>
        </span>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}>
            <div className="flex gap-4 w-full">
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <Input type="password" id="newPassword" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="confirmpassword">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" id="confirmpassword" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button
                    className="mt-4  bg-primary hover:bg-primary/80 dark:bg-primary dark:hover:bg-primary/80"
                    type="submit"
                    onClick={() =>
                      toast({
                        title: formSuccess && formSuccess.title,
                        description: formSuccess && formSuccess.desc,
                      })
                    }
                  >
                    {mutation.isLoading && <Loader2 className={`animate-spin w-4 h-4`} />}
                    {mutation.isLoading ? "submit..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
            {mutation.error && (
              <div className="mt-2">
                <div className="flex items-center gap-2 p-2 bg-red-100 rounded-full text-red-600 justify-center">
                  <p>{mutation?.error?.response?.data.message}</p>
                  <Check className="h-4 w-4" />
                </div>
              </div>
            )}

            {mutation.isSuccess && (
              <div className="mt-2">
                <div className="flex items-center gap-2 p-2 bg-green-100 rounded-full text-green-600 justify-center">
                  <p>Success</p>
                  <Check className="h-4 w-4" />
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
export default ResetPassword;
