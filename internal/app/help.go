package app

import (
	"fmt"
	"io"
)

func printHelp(w io.Writer, version string) {
	fmt.Fprintf(w, `mr-mauroo-ai — Mr-Mauroo-AI: Ecosystem, Frameworks, Workflows (%s)

USAGE
  mr-mauroo-ai                     Launch interactive TUI
  mr-mauroo-ai <command> [flags]

COMMANDS
  install      Configure AI coding agents on this machine
  uninstall    Remove Mr.Mauroo AI managed files from this machine
  sync         Sync agent configs and skills to current version
  skill-registry refresh
               Refresh .atl/skill-registry.md with cache-hit fast path
  sdd-status [change]
               Print native SDD phase status for orchestrators
  sdd-continue [change]
               Print native SDD dispatcher routing output
  update       Check for available updates
  upgrade      Apply updates to managed tools
  restore      Restore a config backup
  doctor       Run ecosystem health diagnostics
  version      Print version

FLAGS
  --help, -h    Show this help

Run 'mr-mauroo-ai help' for this message.
Documentation: https://github.com/Mr-Mauroo/mr-mauroo-ai
`, version)
}
