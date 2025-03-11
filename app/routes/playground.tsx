import {
  createFileRoute,
  Outlet,
  useLoaderData,
  useLocation,
} from '@tanstack/react-router'
import { SettingsMenu } from '~/components/settings-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { Textarea } from '~/components/ui/textarea'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
  loader: async () => {
    return 'hello world'
  },
})

function RouteComponent() {
  const selectedSetting = useLocation({
    select: (location) =>
      location.pathname.split('/').pop() as 'appearance' | 'font',
  })
  const data = useLoaderData({ from: '/playground' })

  return (
    <SidebarProvider>
      <div className="h-screen">
        <div className="grid h-full grid-cols-[auto_auto_1fr]">
          <Sidebar>
            <SidebarContent>{JSON.stringify(data)}</SidebarContent>
          </Sidebar>
          <div className="flex flex-col border-r border-border p-8">
            <div className="flex-1">
              <SettingsMenu selection={selectedSetting} />
              <label htmlFor="textarea">
                Textarea
                <Textarea id="textarea" className="[field-sizing:content]" />
              </label>
            </div>
            <SidebarTrigger className="text-muted-foreground" />
          </div>
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

const loremIpsum = `"Lorem ipsum odor amet, consectetuer adipiscing elit. Tristique laoreet curabitur consectetur interdum sollicitudin orci habitasse habitasse odio. Scelerisque facilisi duis taciti nisl id ligula blandit netus. Aeros rutrum ullamcorper inceptos proin orci mi magnis. Praesent dapibus tortor habitasse quis augue ad. Penatibus dis dignissim faucibus non convallis? Et rutrum libero urna quis cras justo blandit rutrum maximus. Porta lectus ac est senectus fames libero. Vulputate iaculis quam ante tincidunt suspendisse est?

Vitae volutpat ut placerat mus purus metus iaculis dictum. Nostra proin blandit tristique risus rhoncus risus nascetur. Facilisi rhoncus venenatis facilisis purus posuere eleifend nisi. Laoreet varius molestie litora tortor condimentum hendrerit. Id porttitor tortor aliquet sed, dignissim hac augue. Magna amet facilisi consectetur risus feugiat tempus vivamus. Risus rutrum inceptos; erat adipiscing rhoncus ultricies velit pellentesque. Suspendisse porta sociosqu tempus dictum per ornare.

Ullamcorper eget tempus curae convallis, in dignissim netus. Bibendum ornare aptent non nibh dis porta maximus iaculis. Platea ante dis elit sem bibendum. Hac turpis quisque felis commodo, maecenas dignissim nullam litora. Tristique libero interdum convallis inceptos enim senectus. Vitae malesuada interdum iaculis sodales magnis. Lacinia congue auctor himenaeos natoque lorem quisque commodo. Ultricies scelerisque neque vestibulum eu purus, praesent consequat quam. Facilisis ut dignissim duis neque finibus id dictum dignissim tellus.

Inceptos consequat magna; facilisi eros senectus curae. Quisque fringilla ullamcorper mollis fermentum vehicula efficitur himenaeos. Amet morbi arcu consectetur parturient dis hendrerit. Molestie tellus diam taciti senectus pellentesque ante. Auctor tortor at fusce ad magna odio tempus. Enim posuere euismod finibus justo nec leo. Sollicitudin pulvinar ridiculus lectus quisque sem sem praesent metus lectus. Potenti amet purus aliquam dui eget ex nam libero?

Condimentum interdum vestibulum neque senectus nullam risus. Nisi efficitur sollicitudin praesent convallis fusce consectetur ligula sed lacus. Quam montes convallis lorem vel rhoncus himenaeos ullamcorper. Morbi ad ullamcorper scelerisque malesuada montes quam. Posuere est tristique nisi tincidunt natoque magnis. Etiam donec justo tempor porttitor scelerisque dolor primis blandit. Condimentum quam habitasse etiam tempor velit ad consectetur; quis turpis. Montes dis curae amet scelerisque donec id turpis conubia.

Diam leo nunc ex sagittis venenatis lobortis ad pellentesque. Magnis nulla massa nunc nam ac lacus tempus nisl amet. Porta augue pharetra sodales aptent nullam velit. Vehicula ullamcorper consectetur curae tortor pharetra nulla elit? Nunc per tempor cras iaculis, consectetur integer. Donec ut interdum rhoncus fames porta tortor ullamcorper accumsan rhoncus. Eu ridiculus ad massa libero dapibus sed scelerisque elementum. Sed sem ipsum integer; feugiat sit leo. Platea congue egestas non sit hac; consectetur curae sociosqu.

Id integer vivamus pulvinar in cubilia ultrices. Dolor tempor sapien fames fermentum imperdiet. Suspendisse rhoncus ex nascetur ante himenaeos class faucibus. Felis ipsum torquent leo mollis tincidunt egestas. At mattis gravida taciti leo risus diam conubia. Phasellus nascetur ante donec; et tortor gravida leo nullam amet.

Lacinia purus natoque ante nam nunc aliquet vitae pretium. Posuere curabitur bibendum eleifend in aliquet. Vestibulum nam in class mi eros id diam. Cubilia auctor venenatis efficitur ex tortor senectus. Ultricies quisque rhoncus aliquam nisi mattis dignissim. Nulla nunc per fusce erat feugiat curae class magna. Cubilia cursus mauris ornare iaculis molestie velit nisl. Ullamcorper commodo pharetra etiam congue, varius massa magnis duis. Elit volutpat suspendisse, commodo nullam metus tristique turpis curae."`
