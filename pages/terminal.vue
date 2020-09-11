<template>
  <div class="terminal" v-on:click="focusInput">
    <div
      v-for="(cmnd, index) in output"
      :key="index"
      v-bind:class="{
        inputText: cmnd.charAt(0) === '>',
        inputTextBlue: cmnd.charAt(0) === '*'
      }"
    >
      {{ cmnd }}
    </div>
    <div ref="inputBlock" style="color: yellow;">
      >
      <input
        v-model="command"
        v-on:keyup.enter="onEnter"
        class="terminal-input"
        type="text"
        ref="inputCmd"
      />
    </div>
  </div>
</template>
<script>
import { gameLevels } from './game.js'
console.log('game: ', gameLevels)

export default {
  data: function() {
    return {
      queue: [],
      output: [],
      command: '',
      timerRunning: false,
      inventory: [],
      level: 1,
      levels: gameLevels
    }
  },
  methods: {
    outputMessages(...messages) {
      // The view model.
      var vm = this
      messages.reverse()
      console.log('messages: ', messages)
      messages.forEach(function(item, index) {
        console.log('item: ', item)
        vm.queue.push(item)
      })
    },
    focusInput() {
      if (this.$refs.inputBlock) {
        this.$refs.inputCmd.focus()
      }
    },
    onEnter: function() {
      const vm = this

      function moveLevel(currentLevel, direction) {
        let dir = direction.toLowerCase()
        console.log('dir: ', dir)
        console.log('currentLevel: ', currentLevel)
        console.log('moveLevel')
        if (!['NORTH', 'SOUTH', 'EAST', 'WEST'].includes(direction)) {
          vm.outputMessages('This is not a direction of travel.')
          return
        }
        console.log('currentLevel[dir]: ', currentLevel[dir])
        if (currentLevel[dir]) {
          console.log('currentLevel[dir]: ', currentLevel[dir])
          if (isNaN(currentLevel[dir])) {
            vm.outputMessages(currentLevel[dir])
            return
          }
          vm.level = currentLevel[dir]
          let nextLevel = vm.levels.find(l => l.id == vm.level)
          if (!nextLevel) {
            vm.outputMessages('This was not suppose to happen.')
            return
          }
          vm.outputMessages('* ' + nextLevel.name, nextLevel.story)
        } else {
          vm.outputMessages("You can't travel in that direction here")
          return
        }
      }

      this.output.push('> ' + this.command)

      const command = this.command.split(' ')
      console.log('command: ', command)

      let level = this.levels.find(l => l.id == this.level)
      console.log('level: ', level)

      switch (command[0].toUpperCase()) {
        case 'VIEW':
          this.outputMessages(
            'Your inventory contains',
            this.inventory.join(', ')
          )
          break
        case 'GO':
          let direction = command[1] ? command[1].toUpperCase() : null
          moveLevel(level, direction)
          break
        case 'INSPECT':
          let itemToInspect = command[1] ? command[1].toUpperCase() : null
          let inspectableItem =
            level.inspections &&
            level.inspections.find(a => a.item == itemToInspect)
          if (inspectableItem) {
            this.outputMessages(inspectableItem.story)
            Object.assign(level, inspectableItem.result)
            break
          }
          this.outputMessages('There is no ' + itemToInspect + ' here.')
          break
        case 'USE':
          let item = command[1] ? command[1].toUpperCase() : null
          if (this.inventory.includes(item)) {
            // Check if level allows use of this item

            let usableItem =
              level.actions && level.actions.find(a => a.item == item)

            if (usableItem) {
              this.outputMessages(
                'You attempt to use ' + item,
                usableItem.story
              )
              Object.assign(level, usableItem.result)
              var index = vm.inventory.indexOf(item)
              if (index > -1) {
                vm.inventory.splice(index, 1)
              }
              break
            }
            this.outputMessages(
              'You attempt to use ' + item,
              'It has no effect!'
            )
            break
          }
          this.outputMessages('You do not have a ' + item)
          break
        case 'PICK':
          // assume UP
          let itemToPickUp = command[2] ? command[2].toUpperCase() : null
          if (level.collectors.includes(itemToPickUp)) {
            if (this.inventory.includes(itemToPickUp)) {
              this.outputMessages(
                'You already have ' + itemToPickUp + ' in your inventory.'
              )
              break
            }
            this.outputMessages(
              'You pick up ' + itemToPickUp,
              itemToPickUp + ' has been added to your inventory!'
            )
            this.inventory.push(itemToPickUp)
            break
          }
          this.outputMessages('There cannot pick up ' + itemToPickUp)
          break
        case 'MAP':
          let north = '|------------------------------|'
          let east = '  |'
          let south = '|------------------------------|'
          let west = '|  '
          if (level.north) north = '|------------] [---------------|'
          if (level.east) east = '>>>>'
          if (level.south) south = '|------------] [---------------|'
          if (level.west) west = '<<<<'

          this.output.push('MAP OF ' + level.name)
          this.output.push(north)
          this.output.push('|                         N    |')
          this.output.push('|                       W + E  |')
          this.output.push('|                         S    |')
          this.output.push(west + '          O              ' + east)
          this.output.push('|                              |')
          this.output.push('|                              |')
          this.output.push('|                              |')
          this.output.push(south)
          this.focusInput()
          break

        case 'HELP':
          this.outputMessages(
            'You can use the following commands: ',
            ' - GO [NORTH/SOUTH/EAST/WEST]',
            ' - PICK UP [ITEM]',
            ' - USE [ITEM]',
            ' - VIEW INVENTORY'
          )
          break
        default:
          this.outputMessages('Command not recognised')
          break
      }

      this.command = ''
      return
    }
  },
  watch: {
    queue(newValue) {
      let index = 0
      let currentPos = 0
      let totalPos = 0
      console.log('this.timerRunning: ', this.timerRunning)
      if (newValue.length > 0 && !this.timerRunning) {
        this.output.push('_')
        var x = setInterval(
          function() {
            this.timerRunning = true
            this.$refs.inputBlock.hidden = true
            if (newValue.length <= 0) {
              console.log('Nothing more so killing interval')
              this.timerRunning = false
              this.$refs.inputBlock.hidden = false
              this.focusInput()
              clearInterval(x)
              return
            }

            index = newValue.length - 1
            console.log('index: ', index)
            let newOutput = newValue[index]
            let outputRow = this.output.length - 1
            totalPos = newOutput.length

            this.$set(
              this.output,
              outputRow,
              this.output[outputRow].slice(0, -1) + newOutput.charAt(currentPos)
            )

            if (currentPos === totalPos) {
              newValue.pop()
              currentPos = 0
              if (newValue.length > 0) {
                this.output.push('_')
              }
            } else {
              this.$set(this.output, outputRow, this.output[outputRow] + '_')
              currentPos++
            }
          }.bind(this),
          10
        )
      }
    }
  },
  mounted() {
    this.focusInput()
    let level = this.levels.find(l => l.id == this.level)
    this.outputMessages(
      'Adventure Game',
      'Version 1.0',
      '-------------------------',
      '* ' + level.name,
      level.story
      //'Test terminal'
    )
  }
}
</script>
<style scoped>
.terminal {
  background-color: black;
  font-family: monospace;
  font-size: 14px;
  color: #d2d2d2;
  min-height: 100%;
  width: 100%;
}
.terminal-input {
  background: #000;
  font-family: monospace;
  font-size: 14px;
  color: yellow;
  outline: none;
  border: 0px;
  width: 90%;
}
.inputText {
  color: yellow;
}
.inputTextBlue {
  color: aquamarine;
}
</style>
