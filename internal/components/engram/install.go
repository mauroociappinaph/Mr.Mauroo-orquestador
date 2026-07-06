package engram

import (
	"github.com/mr-mauroo/mr-mauroo-ai/internal/installcmd"
	"github.com/mr-mauroo/mr-mauroo-ai/internal/model"
	"github.com/mr-mauroo/mr-mauroo-ai/internal/system"
)

func InstallCommand(profile system.PlatformProfile) ([][]string, error) {
	return installcmd.NewResolver().ResolveComponentInstall(profile, model.ComponentEngram)
}
