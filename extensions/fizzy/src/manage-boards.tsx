import { FormValidation, useCachedPromise, useForm } from "@raycast/utils";
import { fizzy } from "./fizzy";
import { Action, ActionPanel, Color, environment, Form, Grid, Icon, showToast, Toast, useNavigation } from "@raycast/api";

export default function ManageBoards() {
  const {isLoading, data: boards,mutate} = useCachedPromise(fizzy.boards.list, [], {initialData:[]})

  return <Grid isLoading={isLoading}>
    {boards.map(board => <Grid.Item key={board.id} content={{source: "board.svg", tintColor: environment.appearance==="dark" ?  Color.PrimaryText : undefined}} title={board.name} actions={<ActionPanel>
        <Action.OpenInBrowser url={board.url} />
        <Action.Push icon={Icon.Plus} title="Add Board" target={<AddBoard />} onPop={mutate} />
    </ActionPanel>} />)}
  </Grid>
}

function AddBoard() {
    const {pop} = useNavigation();
    const {handleSubmit,itemProps} = useForm<{name: string, auto_postpone_period: string}>({
        async onSubmit(values) {
            const toast = await showToast(Toast.Style.Animated, "Creating", values.name)
            try {
                await fizzy.boards.create({name: values.name, auto_postpone_period: +values.auto_postpone_period})
                toast.style = Toast.Style.Success;
                toast.title = "Created";
                pop();
            } catch (error) {
                toast.style = Toast.Style.Failure;
                toast.title = "Failed";
                toast.message = `${error}`
            }
        },
        initialValues: {
            auto_postpone_period: "365"
        },
        validation: {
            name: FormValidation.Required
        }
    })
  return <Form actions={<ActionPanel>
    <Action.SubmitForm icon={Icon.Plus} title="Create Board" onSubmit={handleSubmit} />
  </ActionPanel>}>
  <Form.TextField title="Name" placeholder="Name it..." {...itemProps.name} />
  <Form.Dropdown title="Auto close" info="Fizzy doesn't let stale cards stick around forever. Cards automatically move to “Not now” if no one updates, comments, or moves a card for…" {...itemProps.auto_postpone_period}>
    {[3,7,30,90,365,11].map(day => <Form.Dropdown.Item key={day} title={`${day} days`} value={`${day}`} />)}
  </Form.Dropdown>
  </Form>
}
