package catalog

import "github.com/mr-mauroo/mr-mauroo-ai/internal/model"

type Component struct {
	ID          model.ComponentID
	Name        string
	Description string
}

var mvpComponents = []Component{
	{ID: model.ComponentEngram, Name: "Engram", Description: "Persistent cross-session memory"},
	{ID: model.ComponentSDD, Name: "SDD", Description: "Spec-driven development workflow"},
	{ID: model.ComponentSkills, Name: "Skills", Description: "Curated coding skill library"},
	{ID: model.ComponentContext7, Name: "Context7", Description: "Latest framework and library docs"},
	{ID: model.ComponentPersona, Name: "Persona", Description: "Mr.Mauroo, neutral or custom behavior"},
	{ID: model.ComponentPermission, Name: "Permissions", Description: "Security-first defaults and guardrails"},
	{ID: model.ComponentGGA, Name: "GGA", Description: "Mr.Mauroo Guardian Angel — AI provider switcher"},
	{ID: model.ComponentTheme, Name: "Theme", Description: "Mr.Mauroo Kanagawa theme overlay"},
	{ID: model.ComponentClaudeTheme, Name: "Claude Mr.Mauroo Theme", Description: "Claude Code Mr.Mauroo custom theme"},
	{ID: model.ComponentOpenCodeGentleLogo, Name: "OpenCode Gentle Logo", Description: "OpenCode home logo TUI plugin with Braille rose"},
}

func MVPComponents() []Component {
	components := make([]Component, len(mvpComponents))
	copy(components, mvpComponents)
	return components
}
