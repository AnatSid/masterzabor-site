import Image from "next/image";
import Link from "next/link";
import { SiteContainer } from "@/components/layout/SiteContainer";

const linkClassName =
  "font-medium text-[#0A5633] underline decoration-green-700/30 underline-offset-4 transition hover:decoration-green-700 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5633]";

export function ProfnastilGuide() {
  return (
    <section aria-label="Как выбрать забор из профнастила" className="py-16 sm:py-20">
      <SiteContainer>
        <div className="mx-auto max-w-6xl space-y-16 sm:space-y-20">
          <section aria-labelledby="profnastil-construction">
            <div className="max-w-3xl">
              <h2 id="profnastil-construction" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Из чего состоит забор из профнастила
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-700">
                Лист закрывает пролёт, а держится он на каркасе. Чтобы обсуждать
                стоимость и внешний вид будущего забора, полезно понимать роль
                каждой части конструкции.
              </p>
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12">
              <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F6F8F5]">
                <Image
                  src="/images/services/zabory-iz-profnastila/construction-guide.webp"
                  alt="Поясняющая иллюстрация секции забора: профилированный лист, столбы, горизонтальные поперечины и крепёж"
                  width={1448}
                  height={1086}
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  className="h-auto w-full"
                />
                <figcaption className="px-5 py-3 text-sm leading-relaxed text-slate-600">
                  Поясняющая иллюстрация конструкции. Это не фотография нашей
                  работы и не монтажный чертёж.
                </figcaption>
              </figure>

              <dl className="divide-y divide-slate-200 border-y border-slate-200">
                <div className="py-4 first:pt-0 lg:first:pt-4">
                  <dt className="font-semibold text-slate-950">Профилированный лист</dt>
                  <dd className="mt-1 leading-relaxed text-slate-700">
                    Образует сплошное заполнение пролёта. При выборе обсуждают
                    профиль, толщину, покрытие и цвет листа.
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="font-semibold text-slate-950">Столбы</dt>
                  <dd className="mt-1 leading-relaxed text-slate-700">
                    Служат опорами для секций. Их исполнение и основание подбирают
                    с учётом участка и будущей конструкции.
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="font-semibold text-slate-950">Поперечины</dt>
                  <dd className="mt-1 leading-relaxed text-slate-700">
                    Соединяют столбы и образуют каркас, к которому крепят листы.
                  </dd>
                </div>
                <div className="py-4 last:pb-0 lg:last:pb-4">
                  <dt className="font-semibold text-slate-950">Крепёж и детали</dt>
                  <dd className="mt-1 leading-relaxed text-slate-700">
                    Удерживают листы на каркасе. Состав дополнительных элементов
                    зависит от согласованного варианта забора.
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section aria-labelledby="profnastil-choice" className="border-t border-slate-200 pt-12 sm:pt-16">
            <div className="max-w-3xl">
              <h2 id="profnastil-choice" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Как выбрать лист и конструкцию под участок
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-700">
                Одного цвета листа для выбора недостаточно. На конструкцию и
                итоговую стоимость влияют размеры забора, условия участка и то,
                нужны ли ворота или калитка.
              </p>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Лист и внешний вид</h3>
                <p className="mt-3 leading-relaxed text-slate-700">
                  У профнастила бывают разные профиль, толщина и защитное
                  покрытие. Эти параметры стоит согласовать вместе с высотой и
                  цветом: они влияют на внешний вид, условия эксплуатации и
                  стоимость материала. Если забор должен сочетаться с домом или
                  въездной группой, полезно сразу показать желаемый цвет и вид
                  ворот.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Опоры и монтаж</h3>
                <p className="mt-3 leading-relaxed text-slate-700">
                  Сплошное полотно испытывает ветровую нагрузку. Поэтому высоту,
                  каркас и столбы рассматривают вместе, а основание выбирают
                  после оценки грунта и рельефа. Перепады участка и расположение
                  ворот с калиткой тоже лучше обсудить до расчёта, чтобы
                  согласовать состав работ.
                </p>
              </div>
            </div>

            <p className="mt-8 border-l-4 border-[#0A5633] pl-5 leading-relaxed text-slate-700">
              Для предварительного расчёта сообщите примерную длину и высоту
              забора, город или населённый пункт, особенности участка и нужны ли
              ворота с калиткой. Точные параметры можно уточнить при обсуждении
              проекта. Что влияет на итоговую сумму, показано также на{" "}
              <Link href="/tseny" className={linkClassName}>странице цен</Link>.
            </p>
          </section>

          <section aria-labelledby="profnastil-fit" className="border-t border-slate-200 pt-12 sm:pt-16">
            <div className="max-w-3xl">
              <h2 id="profnastil-fit" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Когда подходит сплошной забор
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-700">
                Профнастил закрывает участок от обзора через пролёты. Это удобно,
                когда важна приватность вдоль улицы или соседней территории.
                При этом сплошное заполнение нужно учитывать при выборе опор и
                каркаса, особенно на открытом участке.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#F6F8F5] px-6 py-7 sm:px-8 sm:py-8">
              <h3 className="text-xl font-semibold text-slate-950">
                Если хочется оставить просветы
              </h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
                Сравните профнастил с евроштакетником: у него заполнение
                собирают из отдельных планок, а степень закрытости зависит от
                расположения планок. Выбор лучше привязать к тому, сколько
                обзора и света вы готовы оставить на участке, а также к виду
                дома и ворот. Варианты установки описаны на{" "}
                <Link href="/zabory-iz-evroshtaketnika" className={linkClassName}>
                  странице заборов из евроштакетника
                </Link>.
              </p>
            </div>
          </section>
        </div>
      </SiteContainer>
    </section>
  );
}
