import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormLabel, FormItem, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../schema/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { postAPI } from "@/api/api";

const Login = ({ setToken }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const initForm = {
    email: "",
    password: "",
  };

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: initForm,
  });

  const mutation = useMutation({
    mutationFn: async (newEvents) => {
      const res = await postAPI("user/login", newEvents);
      setToken(res.data);
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

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div>
        <span className="flex items-center gap-2 mb-6">
          <ArrowLeft className="w-6 h-6" onClick={() => navigate("/")} />
          <Label className="font-bold text-sm">Login</Label>
        </span>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}>
            <div className="flex gap-4 w-full">
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input type="email" id="email" placeholder="example@mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input type="password" id="password" placeholder="******" {...field} />
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
                    {mutation.isLoading ? "login..." : "Login"}
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <FormLabel>{`Don't have an account yet`}</FormLabel>
                  <Link className="ms-2 font-light text-blue-700 text-sm" to="/register">
                    here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default Login;

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };
