package screens

import (
	"strings"

	"github.com/mr-mauroo/mr-mauroo-ai/internal/model"
	"github.com/mr-mauroo/mr-mauroo-ai/internal/tui/styles"
)

func PersonaOptions() []model.PersonaID {
	return []model.PersonaID{model.PersonaMrMauroo, model.PersonaMrMaurooNeutralArtifacts, model.PersonaNeutral, model.PersonaCustom}
}

var personaDescriptions = map[model.PersonaID]string{
	model.PersonaMrMauroo:                 "Managed Mr.Mauroo persona with teaching-first guidance",
	model.PersonaMrMaurooNeutralArtifacts: "Mr.Mauroo conversation with English technical artifacts and comments in context language",
	model.PersonaNeutral:                   "Managed neutral persona with the same guidance and less regional tone",
	model.PersonaCustom:                    "Keep your existing persona unmanaged; mr-mauroo-ai does not inject a persona",
}

func RenderPersona(selected model.PersonaID, cursor int) string {
	var b strings.Builder

	b.WriteString(styles.TitleStyle.Render("Choose your Persona"))
	b.WriteString("\n\n")
	b.WriteString(styles.SubtextStyle.Render("Your own Mr.Mauroo! teaches before it solves."))
	b.WriteString("\n\n")

	for idx, persona := range PersonaOptions() {
		isSelected := persona == selected
		focused := idx == cursor
		b.WriteString(renderRadio(string(persona), isSelected, focused))
		b.WriteString(styles.SubtextStyle.Render("    " + personaDescriptions[persona]))
		b.WriteString("\n")
	}

	b.WriteString("\n")
	b.WriteString(renderOptions([]string{"Back"}, cursor-len(PersonaOptions())))
	b.WriteString("\n")
	b.WriteString(styles.HelpStyle.Render("j/k: navigate • enter: select • esc: back"))

	return b.String()
}
