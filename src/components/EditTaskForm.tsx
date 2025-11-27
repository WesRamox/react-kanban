import { FileIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  RadioGroup,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import React, { type FormEventHandler } from "react";
import z from "zod";
import { useTasks } from "../hooks/useTasks";

const EditTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["todo", "doing", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

export const EditTaskForm: React.FC<{
  taskId: string;
}> = ({ taskId }) => {
  const { fetchTaskById, editTask } = useTasks();
  const [open, setOpen] = React.useState(false);
  const [task, setTask] = React.useState<z.infer<typeof EditTaskSchema> | null>(null);

  const loadTask = async () => {
    const fetchedTask = await fetchTaskById(taskId);
    setTask(fetchedTask);
  };

  const handleSubmit: FormEventHandler<
    HTMLFormElement
  > = async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");
    const status = formData.get("status");
    const priority = formData.get("priority");

    ev.currentTarget.reset();

    const taskData = EditTaskSchema.parse({
      title,
      description,
      status,
      priority,
    });

    await editTask(taskId, taskData);
    setTask(taskData);
    setOpen(false);
  };
  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger>
        <Button
          onClick={loadTask}
          variant="ghost"
          style={{right: "20px", position: "absolute"}}
        >
          <FileIcon /> Editar
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="32rem">
        <Dialog.Title>Editar Tarefa</Dialog.Title>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Box maxWidth="32rem">
              <Box mb="2">
                <Text as="label" htmlFor="title">
                  Título
                </Text>
              </Box>
              <TextField.Root
                placeholder="Defina um titulo"
                name="title"
                id="title"
                defaultValue={task?.title}
                autoFocus
                required
              />
            </Box>

            <Box maxWidth="32rem">
              <Box mb="2">
                <Text
                  as="label"
                  htmlFor="description"
                >
                  Descrição
                </Text>
              </Box>
              <TextArea
                placeholder="Descreva a tarefa"
                name="description"
                id="description"
                defaultValue={task?.description}
                required
              />
            </Box>

            <Flex gap="8">
              <Box>
                <Text as="div" mb={"2"}>
                  Situação
                </Text>
                <RadioGroup.Root
                  key={task?.status}
                  name="status"
                  defaultValue={task?.status}
                >
                  <RadioGroup.Item value="todo">
                    <Badge color="gray">
                      Para Fazer
                    </Badge>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="doing">
                    <Badge color="yellow">
                      Em Progresso
                    </Badge>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="done">
                    <Badge color="green">
                      Concluída
                    </Badge>
                  </RadioGroup.Item>
                </RadioGroup.Root>
              </Box>

              <Box>
                <Text as="div" mb={"2"}>
                  Prioridade
                </Text>
                <RadioGroup.Root
                  name="priority"
                  key={task?.priority}
                  defaultValue={task?.priority}
                >
                  <RadioGroup.Item value="low">
                    <Badge color="sky">
                      Baixa
                    </Badge>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="medium">
                    <Badge color="amber">
                      Média
                    </Badge>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="high">
                    <Badge color="tomato">
                      Alta
                    </Badge>
                  </RadioGroup.Item>
                </RadioGroup.Root>
              </Box>
            </Flex>

            <Flex gap="2" justify="end">
              <Dialog.Close>
                <Button
                  color="gray"
                  variant="soft"
                >
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit">
                Atualizar tarefa
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
